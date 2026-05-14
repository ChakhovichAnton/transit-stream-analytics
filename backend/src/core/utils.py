from datetime import datetime

def iso_to_millis(s):
    dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
    return int(dt.timestamp() * 1000)
