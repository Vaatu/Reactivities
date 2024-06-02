import { Link } from "react-router-dom";
import { Item, ItemContent, Button, SegmentGroup, Segment, ItemGroup, ItemImage, ItemHeader, ItemDescription, Icon, Label } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";
import ActivityListItemAttendee from "./ActivityListItemAttendee";

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {
    return (
        <SegmentGroup>
            <Segment>
                {activity.isCancelled &&
                    <Label color='red' content='Cancelled' attached="top" style={{ textAlign: 'center' }} />}
                <ItemGroup>
                    <Item>
                        <ItemImage style={{ marginBottom: 5 }} size='tiny' circular src={activity.host?.image || '/assets/user.png'} />
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity.id}`} > {activity.title}</ItemHeader>
                            <ItemDescription>Hosted by <Link to={`/profiles/${activity.hostUsername}`}>{activity.host?.displayName} </Link></ItemDescription>
                            {activity.isHost && (
                                <ItemDescription>
                                    <Label basic color='orange' content='You are hosting this activity' />
                                </ItemDescription>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <ItemDescription>
                                    <Label basic color='green' content='You are going this activity' />
                                </ItemDescription>
                            )}
                        </ItemContent>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View' />
            </Segment>
        </SegmentGroup>
    )
}