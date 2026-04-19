import numpy as np
import pandas as pd


def add_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Add cyclical time features, rolling statistics, lags, and interaction
    features to a DataFrame of daily weather records.
    """
    df = df.copy()

    # ── Cyclical time features ──────────────────────
    df["day_sin"] = np.sin(2 * np.pi * df["dayOfYear"] / 365)
    df["day_cos"] = np.cos(2 * np.pi * df["dayOfYear"] / 365)
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
    df["week_sin"] = np.sin(2 * np.pi * df["dayOfWeek"] / 7)
    df["week_cos"] = np.cos(2 * np.pi * df["dayOfWeek"] / 7)

    # ── Rolling statistics ──────────────────────────
    df["rolling_7d"] = df["precipMm"].rolling(7, min_periods=1).mean()
    df["rolling_14d"] = df["precipMm"].rolling(14, min_periods=1).mean()
    df["rolling_30d"] = df["precipMm"].rolling(30, min_periods=1).mean()

    # ── Lag features ────────────────────────────────
    for lag in range(1, 15):
        df[f"lag_{lag}d"] = df["precipMm"].shift(lag)

    # ── CAPE moving-max ─────────────────────────────
    df["cape_ma_3d"] = df["capeMax"].rolling(3, min_periods=1).max()

    # ── Ratio feature ───────────────────────────────
    rolling_mean = df["rolling_7d"].mean()
    df["precip_ma_7d_ratio"] = df["rolling_7d"] / (rolling_mean + 1e-6)

    # ── Humidity interaction (simplified) ───────────
    df["humidity_pressure"] = df["humidityMean"] * 0.01

    # ── Fill NaN from rolling / lag with 0 ──────────
    df = df.fillna(0)

    return df
