import { observer } from "mobx-react-lite";
import { Card, CardContent, CardGroup, CardHeader, Grid, GridColumn, Header, Image, Tab, TabPane, TabProps } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useEffect } from "react";
import { UserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { format } from "date-fns";
const panes = [
    { menuItem: 'Future Events', pane: { key: 'future' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } }
];
export default observer(function ProfileActivities() {
    const { profileStore } = useStore();
    const { loadingActivities, userActivities, loadUserActivities, profile } = profileStore;

    const handleTabChange = (_: SyntheticEvent, data: TabProps) => {
        loadUserActivities(profile!.username, panes[data.activeIndex as
            number].pane.key);
    };
    useEffect(() => {
        loadUserActivities(profile!.username, 'future');

    }, [loadUserActivities, profile])



    return (<TabPane loading={loadingActivities}>
        <Grid>
            <GridColumn width={16}>
                <Header floated='left' icon='calendar' content={'Activities'} />
            </GridColumn>
            <GridColumn width={16}>
                <Tab
                    panes={panes}
                    menu={{ secondary: true, pointing: true }}
                    onTabChange={(e, data) => handleTabChange(e, data)}
                />
                <br />
                <CardGroup itemsPerRow={4}>
                    {userActivities.map((activity: UserActivity) => (
                        <Card
                            key={activity.id}
                            as={Link}
                            to={`/activities/${activity.id}`}
                        >
                            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
                            <CardContent  >
                                <CardHeader textAlign='center'>{activity.title}</CardHeader>
                                <Card.Meta textAlign='center'>
                                    <div>{format(new Date(activity.date), 'do LLL')}</div>
                                    <div>{format(new Date(activity.date), 'h:mm a')}</div>
                                </Card.Meta>
                            </CardContent>
                        </Card>
                    ))}
                </CardGroup>
            </GridColumn>
        </Grid>
    </TabPane>)
})