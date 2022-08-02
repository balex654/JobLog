FROM python:3.9

WORKDIR /

COPY ./requirements.txt /requirements.txt

RUN pip install -r requirements.txt

COPY ./ /

EXPOSE 8000

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["python manage.py migrate; gunicorn job_log.wsgi -b 0.0.0.0:8000"]