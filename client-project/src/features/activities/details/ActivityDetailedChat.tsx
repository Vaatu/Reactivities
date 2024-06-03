import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import MyTextArea from '../../../app/common/form/MyTextArea';
import { formatDistanceToNow, isValid } from 'date-fns';
import * as Yup from 'yup';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) commentStore.createHubConnection(activityId);
        return () => {
            commentStore.stopHubConnection();
        }
    }, [commentStore, activityId])
    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Formik
                    onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                    initialValues={{ body: '' }}
                    validationSchema={Yup.object(
                        {
                            body: Yup.string().required()
                        })
                    }
                >
                    {({ isSubmitting, handleSubmit, isValid }) => (
                        <Form className='ui form'>
                            <Field name='body' placeholder='Enter your comment...' rows={2} >
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, SHIFT + Enter for new line)'
                                            rows={2}
                                            {...props.field}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                } else if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();

                                                }
                                            }}
                                        />

                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>${comment.displayName}`</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }} >{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}



                </Comment.Group>
            </Segment>
        </>

    )
})
