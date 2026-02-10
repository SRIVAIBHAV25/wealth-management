from passlib.context import CryptContext
from jose import jwt
from datetime import timedelta, datetime

# =========================
# PASSWORD HASHING
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")[:72]
    return pwd_context.hash(password_bytes)

def verify_password(plain: str, hashed: str) -> bool:
    plain_bytes = plain.encode("utf-8")[:72]
    return pwd_context.verify(plain_bytes, hashed)

# =========================
# JWT
# =========================

SECRET_KEY = "super-secret-key-change-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    to_encode["sub"] = str(to_encode["sub"])  # REQUIRED
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
