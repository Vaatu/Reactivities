import { Card, CardContent, CardDescription, CardHeader, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile"
import { Link } from "react-router-dom";

interface Props {
    profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`} >
            <Image src={profile.image || '/assets/user.png'} />
            <CardContent>
                <CardHeader>{profile.displayName}</CardHeader>
                <CardDescription>{profile.bio || 'Bio Goes Here'}</CardDescription>
            </CardContent>
            <CardContent extra>
                <Icon name='user' />
                20 followers
            </CardContent>
        </Card>
    )
}