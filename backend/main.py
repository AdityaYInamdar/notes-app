from fastapi import FastAPI, Form, HTTPException
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI(
    title="On-site Form Builder",

)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)
NOTES_FILE = 'notes.json'

class Note(BaseModel):
    id: Optional[float] = None
    title: str
    content: str

def read_notes():
    if not os.path.exists(NOTES_FILE):
        return []
    with open(NOTES_FILE, 'r') as file:
        return json.load(file)

def write_notes(notes):
    with open(NOTES_FILE, 'w') as file:
        json.dump(notes, file)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.get('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    return {'status': 'parsed'}

@app.get('/notes')
def list_notes():
    return read_notes()

@app.post('/notes')
def add_note(note: Note):
    notes = read_notes()
    note.id = max([n['id'] for n in notes], default=0) + 1 if note.id is None else note.id
    notes.append(note.dict())
    write_notes(notes)
    return {'status': 'note added'}

@app.put('/notes/{note_id}')
def modify_note(note_id: float, note: Note):
    notes = read_notes()
    for n in notes:
        if n['id'] == note_id:
            n['title'] = note.title
            n['content'] = note.content
            write_notes(notes)
            return {'status': 'note modified'}
    raise HTTPException(status_code=404, detail='Note not found')

@app.delete('/notes/{note_id}')
def delete_note(note_id: float):
    notes = read_notes()
    notes = [n for n in notes if n['id'] != note_id]
    write_notes(notes)
    return {'status': 'note deleted'}
