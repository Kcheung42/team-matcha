from project import db
import datetime as dt
from project.models.participant import Participant
from typing import List


class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    start = db.Column(db.DateTime(), nullable=False)
    end = db.Column(db.DateTime(), nullable=False)
    created = db.Column(db.DateTime(), nullable=False)
    status = db.Column(db.Boolean(), nullable=False)  # True active False
                                                      # canceled
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    event = db.relationship('Event', backref='appointments', innerjoin=True,
                            cascade='all, delete-orphan', single_parent=True,
                            uselist=False)


def add_appointment(event_id: int, participants: List[Participant],
                    start=dt.datetime.utcnow() + dt.timedelta(days=1),
                    end=dt.datetime.utcnow() + dt.timedelta(days=1, hours=1),
                    created=dt.datetime.utcnow(), status=True) -> Appointment:
    """
    Creates an appointment, adds both the appointment and the participants and
    returns the created appointment.
    :param event_id: The id for the the associated event
    :param participants: A list of participants or a single participant
    :param start: When the appointment starts in datetime
    :param end: When the appointment ends in datetime
    :param created: When the appointment was created in datetime
    :param status: True: the event is active, False: the event is canceled
    :return: An Appointment object
    """
    if type(participants) == Participant:
        db.session.add(participants)
        appointment = Appointment(start=start, end=end, created=created,
                                  status=status, event_id=event_id,
                                  participants=[participants])
    else:
        for participant in participants:
            db.session.add(participant)
        appointment = Appointment(start=start, end=end, created=created,
                                  status=status, event_id=event_id,
                                  participants=participants)

    db.session.add(appointment)
    return appointment
