from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from auth import authenticate_user, create_access_token
from models import Token
from routers import users, items
from token import router as auth_router

app = FastAPI()
app.include_router(users.router)
app.include_router(items.router)
app.include_router(auth_router)





# Removed, because it's already defined in auth_router (/auth/login)

# @app.post("/token", response_model=Token)
# def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     user = authenticate_user(form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid credentials")
#     token = create_access_token(
#         data={"sub": user.username},
#         expires_delta=timedelta(minutes=30)
#     )
#     return {"access_token": token, "token_type": "bearer"}
