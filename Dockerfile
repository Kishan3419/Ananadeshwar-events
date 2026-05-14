FROM python:3.9-slim

WORKDIR /app

# Clone from GitHub instead of copying local files
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
RUN git clone https://github.com/kishankumar213419/Ananadeshwar_Events.git .

EXPOSE 8000

CMD ["python", "-m", "http.server", "8000"]
