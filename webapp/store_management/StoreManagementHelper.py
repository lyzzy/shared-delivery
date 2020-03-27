# encoding: utf-8

"""
Copyright (c) 2017, Ernesto Ruge
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""

from ..extensions import celery
from ..models import Store, ObjectDump, OpeningTime
from ..extensions import db


@celery.task
def create_store_revision_delay(store_id):
    store = Store.query.get(store_id)
    if not store:
        return
    create_store_revision(store)


def create_store_revision(store):
    object_dump = ObjectDump()
    object_dump.object_id = store.id
    object_dump.object = 'store'
    object_dump.type = 'revision'
    object_dump.data = store.to_dict(children=True)
    db.session.add(object_dump)
    db.session.commit()


def get_opening_times_for_form(store_id):
    opening_times = []
    opening_times_db = OpeningTime.query\
        .filter_by(store_id=store_id)\
        .order_by(OpeningTime.weekday, OpeningTime.open)\
        .all()
    for opening_time_db in opening_times_db:
        ot = opening_time_db.to_dict()
        ot['open'] = opening_time_db.open_out
        ot['close'] = opening_time_db.close_out
        opening_times.append(ot)
    return opening_times