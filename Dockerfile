# syntax=docker/dockerfile:1
FROM python:3.11-alpine
# It specifies the working directory where the Docker container will run
WORKDIR /bykr
# Copying all the application files to the working directory
COPY . .
# Install all the dependencies required to run the Flask application
RUN pip install -r requirements.txt
# Expose the Docker container for the application to run on port 5000
EXPOSE 5000
# The command required to run the Dockerized application
# syntax for running the container - docker run -d -p 5000:5000 bykr.net
CMD ["python", "/bykr/app.py", "--host=0.0.0.0"]