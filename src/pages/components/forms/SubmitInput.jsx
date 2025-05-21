import React from 'react';
import '../../../assets/styles/forms/input.submit.scss';

export default function SubmitInput({ name, value }) {
    return (
        <input className="button input-submit" type="submit" value={`${value}`} id={`${name}`} />
    );
}
