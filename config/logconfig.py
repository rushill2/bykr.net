import os, datetime
import logging

if not os.path.exists("logs/backend_logs"):
    os.makedirs("logs/backend_logs")

logPath = os.path.join("logs/backend_logs")
jsonPath = os.path.join("security")

logFilename = 'backed-log-' + datetime.datetime.now().strftime('%d-%b-%Y-%H-%M') + '.log'
logFormat = logging.Formatter('%(asctime)s :: %(levelname)s : %(name)s: %(message)s', datefmt = '%H:%M:%S')