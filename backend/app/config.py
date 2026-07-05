import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Resolve the absolute path to the .env file in the backend folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILE = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    PORT: int = Field(default=8000, validation_alias="PORT")
    DATABASE_URL: str = Field(default="sqlite:///./agrichat.db", validation_alias="DATABASE_URL")
    MONGO_URI: str | None = Field(default=None, validation_alias="MONGO_URI")
    GEMINI_API_KEY: str | None = Field(default=None, validation_alias="GEMINI_API_KEY")

    # Pydantic V2 Configuration Settings
    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
