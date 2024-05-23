import { Link } from "react-router-dom";
import { Item, ItemContent, Button, SegmentGroup, Segment, ItemGroup, ItemImage, ItemHeader, ItemDescription, Icon } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { format } from "date-fns";

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {
    return (
        <SegmentGroup>
            <Segment>
                <ItemGroup>
                    <Item>
                        <ItemImage size='tiny' circular src='/assets/user.png' />
                        <ItemContent>
                            <ItemHeader as={Link} to={`/activities/${activity.id}`} > {activity.title}</ItemHeader>
                            <ItemDescription>Hosted by Bob</ItemDescription>
                        </ItemContent>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format( activity.date!,'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees goes here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View' />
            </Segment>
        </SegmentGroup>
    )
}