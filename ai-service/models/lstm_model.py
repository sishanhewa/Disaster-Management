import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

METRIC_COL = {
    "precipitation_mm": "precipMm",
    "temp_mean": "tempMean",
    "humidity_mean": "humidityMean",
}

LOOKBACK = 14


class LstmModel:
    """2-layer LSTM for time-series weather forecasting using PyTorch."""

    name = "lstm"

    def predict(
        self, df: pd.DataFrame, metric: str, horizon_days: int
    ) -> tuple[np.ndarray, float]:
        try:
            import torch
            import torch.nn as nn

            col = METRIC_COL.get(metric, metric)
            series = df[col].dropna().values.astype(np.float32)

            if len(series) < LOOKBACK + 10:
                raise ValueError(
                    f"Insufficient data for LSTM: {len(series)} rows (need ≥{LOOKBACK + 10})"
                )

            # Normalize
            mean_val = series.mean()
            std_val = series.std() + 1e-8
            normalized = (series - mean_val) / std_val

            # Create sequences
            X, y = [], []
            for i in range(len(normalized) - LOOKBACK):
                X.append(normalized[i : i + LOOKBACK])
                y.append(normalized[i + LOOKBACK])
            X = torch.FloatTensor(np.array(X)).unsqueeze(-1)  # (N, lookback, 1)
            y = torch.FloatTensor(np.array(y))

            # Define model
            class WeatherLSTM(nn.Module):
                def __init__(self):
                    super().__init__()
                    self.lstm = nn.LSTM(
                        input_size=1,
                        hidden_size=64,
                        num_layers=2,
                        batch_first=True,
                        dropout=0.2,
                    )
                    self.fc = nn.Linear(64, 1)

                def forward(self, x):
                    out, _ = self.lstm(x)
                    return self.fc(out[:, -1, :]).squeeze(-1)

            model = WeatherLSTM()
            optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
            loss_fn = nn.MSELoss()

            # Train
            model.train()
            epochs = 50
            for epoch in range(epochs):
                optimizer.zero_grad()
                pred = model(X)
                loss = loss_fn(pred, y)
                loss.backward()
                optimizer.step()

            # Forecast
            model.eval()
            forecasts = []
            current_input = torch.FloatTensor(normalized[-LOOKBACK:]).unsqueeze(0).unsqueeze(-1)

            with torch.no_grad():
                for _ in range(horizon_days):
                    next_val = model(current_input).item()
                    forecasts.append(next_val)
                    # Shift window
                    new_input = torch.cat(
                        [current_input[:, 1:, :], torch.FloatTensor([[[next_val]]])],
                        dim=1,
                    )
                    current_input = new_input

            # Denormalize
            forecast = np.array(forecasts) * std_val + mean_val
            forecast = np.clip(forecast, 0, None)

            # Quality from final training loss
            final_loss = loss.item()
            quality = max(0.0, min(1.0, 1.0 - final_loss))

            logger.info(
                "LSTM forecast complete: %d days, final_loss=%.4f, quality=%.3f",
                horizon_days,
                final_loss,
                quality,
            )
            return forecast, quality

        except Exception as e:
            logger.warning("LSTM failed: %s – falling back", str(e))
            raise
