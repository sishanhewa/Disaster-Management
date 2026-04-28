import sys
from sqlalchemy import create_engine, text

sys.path.append('/home/azureuser/app')
from app.services.prediction_service import predict_for_station
from app.db.session import SessionLocal

db = SessionLocal()
try:
    stations = db.execute(text("SELECT station_id, station_name, minor_flood_level, major_flood_level FROM stations")).fetchall()
    count = 0
    for sid, s_name, minor, major in stations:
        try:
            print(f"Predicting for {s_name}...")
            result = predict_for_station(
                db=db,
                station_id=sid,
                station_name=s_name,
                minor_flood=minor or 0.0,
                major_flood=major or 0.0
            )
            # The prediction_service already inserts the prediction into the database!
            # So we don't need to insert it manually here!
            if "error" not in result:
                count += 1
        except Exception as e:
            print(f"Failed for {s_name}: {e}")
    db.commit()
    print(f"Successfully generated {count} predictions!")
finally:
    db.close()
