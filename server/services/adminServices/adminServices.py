# services of the admin page
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.admin.adminModels import Admin
from schemas.admin.adminSchemas import AdminCreate, AdminLogin
from core.security import get_password_hash, verify_password, create_access_token

def create_admin_user(db: Session, admin_data: AdminCreate):
    # Check if admin already exists
    if db.query(Admin).filter(Admin.username == admin_data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = get_password_hash(admin_data.password)
    
    new_admin = Admin(
        username=admin_data.username,
        password_hash=hashed_pwd,
        name=admin_data.name
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

def authenticate_admin(db: Session, login_data: AdminLogin):
    admin = db.query(Admin).filter(Admin.username == login_data.username).first()
    
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT Token specific to Admin
    access_token = create_access_token(data={"sub": str(admin.id), "role": "ADMIN"})
    
    return {"access_token": access_token, "token_type": "bearer"}