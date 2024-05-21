import { Button, Form, FormInput, FormTextArea, Segment } from "semantic-ui-react";
import { ChangeEvent, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";



export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity);
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <FormInput placeholder='Title' name='title' value={activity.title} onChange={handleOnChange} />
                <FormTextArea placeholder='Description' name='description' value={activity.description} onChange={handleOnChange} />
                <FormInput placeholder='Category' name='category' value={activity.category} onChange={handleOnChange} />
                <FormInput type='date' placeholder='Date' name='date' value={activity.date} onChange={handleOnChange} />
                <FormInput placeholder='City' name='city' value={activity.city} onChange={handleOnChange} />
                <FormInput placeholder='Venue' name='venue' value={activity.venue} onChange={handleOnChange} />
                <Button onClick={handleSubmit} floated="right" positive type="submit" content="Submit" loading={loading} />
                <Button onClick={closeForm} floated="right" type="button" content="Cancel" />
            </Form>
        </Segment>
    )
})