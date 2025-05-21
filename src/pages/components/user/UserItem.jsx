import UserAvatar from './UserAvatar';
import '../../../assets/styles/user.scss';

export default function UserItem({ avatarUrl, userName, otherClasses }) {
    return (
        <div className={`user__wrapper ${otherClasses}`}>
            <UserAvatar avatarUrl={avatarUrl} />
            <p className="user__name">{userName}</p>
        </div>
    );
}
