import '../../../assets/styles/forms/input.scss';

export default function FormInput({ name, placeholder, value, onChange }) {
    return (
        <input
            className="input"
            type="text"
            name={name}
            id={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

