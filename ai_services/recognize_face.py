import face_recognition
import cv2
import sys
import json
import numpy as np

# 👇 Node.js se encodings aayengi
data = json.loads(sys.stdin.read())

known_encodings = [np.array(e["encoding"]) for e in data]
user_ids = [e["userId"] for e in data]

cam = cv2.VideoCapture(0)
print("Press 's' to recognize face", file=sys.stderr)

matched_user_id = None

while True:
    ret, frame = cam.read()
    cv2.imshow("Recognize Face", frame)

    if cv2.waitKey(1) & 0xFF == ord('s'):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb)

        if len(encodings) == 0:
            print("No face detected", file=sys.stderr)
            break

        live_encoding = encodings[0]

        matches = face_recognition.compare_faces(
            known_encodings,
            live_encoding,
            tolerance=0.45
        )

        if True in matches:
            index = matches.index(True)
            matched_user_id = user_ids[index]

        break

cam.release()
cv2.destroyAllWindows()

# ✅ ONLY JSON OUTPUT
print(json.dumps({
    "matched": matched_user_id is not None,
    "userId": matched_user_id
}))
