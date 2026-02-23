# tables schem of admin table 
from pydantic import BaseModel
from uuid import UUID

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    password: str
    name: str

class AdminResponse(BaseModel):
    id: UUID
    username: str
    name: str

    class Config:
        from_attributes = True