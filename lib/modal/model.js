import mongoose from 'mongoose';
import task from './task';
import collection from './collections';
import subtask from './subtasks';

export const Task = mongoose.models.Task || mongoose.model('Task', task);
export const SubTask = mongoose.models.Subtask || mongoose.model('Subtask', subtask);
export const Collection = mongoose.models.Collection || mongoose.model('Collection', collection)