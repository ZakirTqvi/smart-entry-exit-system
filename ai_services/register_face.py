# ai_services/register_face.py
import face_recognition
import cv2
import sys
import json

user_id = sys.argv[1]

cam = cv2.VideoCapture(0)

# 👇 log goes to stderr (NOT stdout)
print("Press 's' to capture face", file=sys.stderr)

while True:
    ret, frame = cam.read()
    cv2.imshow("Register Face", frame)

    if cv2.waitKey(1) & 0xFF == ord('s'):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb)

        if len(encodings) == 0:
            print("No face detected", file=sys.stderr)
            sys.exit(1)

        encoding = encodings[0].tolist()

        # ✅ ONLY JSON on stdout
        print(json.dumps({
            "userId": user_id,
            "encoding": encoding
        }))

        break

cam.release()
cv2.destroyAllWindows()
sys.exit(0)
