import { safelyGetErrorMessage } from './utils.js';


it('gets string errors', () => {
    expect(safelyGetErrorMessage('an err msg'))
        .toEqual('an err msg');
});

it('gets object errors - although who would make one like this', () => {
    let obj = { 'someprop': 'someval' };
    expect(safelyGetErrorMessage(obj))
        .toEqual('Object error: {"someprop":"someval"}');
});

it('does something useful with number errors', () => {
    expect(safelyGetErrorMessage(1234))
        .toEqual('Unknown error: 1234');
});

it('displays the message of objects with a message property', () => {
    let obj = { 'message': 'my error'};
    expect(safelyGetErrorMessage(obj))
        .toEqual('my error');
});

it('displays the message of errors with a message property', () => {
    expect(safelyGetErrorMessage(new Error('my error')))
        .toEqual('my error');
});

it('displays something useful on errors without messages', () => {
    expect(safelyGetErrorMessage(new Error()))
        .toContain('Unknown trace');
});