import React, { useState } from 'react'

import { formatUSD } from './../../helpers'
import { Provider, useSelector } from 'react-redux';
import moment from 'moment'
import { ChangePasswordComponent } from './change-password';
import { useAppSelector } from 'src/store/hooks';
import { store } from 'src/store';
import ContentWrapper from 'src/components/ContentWrapper';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid, Typography } from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';

function ProfilePageContent () {
    const { subscription, ...me } = useAppSelector(store => store.auth.user);
    const products = useAppSelector(store => store.pricing.plans);
    const { user, logout } = useAuth();

    const selectedPlan = products.find(p => p?.plan?.id === subscription?.subscriptionData?.plan?.id);
    console.log(selectedPlan);
    if (!me) return <React.Fragment><p>Loading</p></React.Fragment>

    const sub$ = () => subscription?.subscriptionData;
    let badge = () => {
        switch (sub$().status) {
            case 'active':
                return <span className={`badge badge-success ml-2`}>{sub$().status}</span>;
            case 'canceled':
                return <span className={`badge badge-danger ml-2`}>{sub$().status}</span>;

            default:
                break;
        }
    }
    return (
        <ContentWrapper>
        <PageTitleWrapper>
            <Grid container alignItems="center">
                <Grid item>
                    <Typography variant="h1" component="h1" gutterBottom>
                    {user?.name}
                    </Typography>
                    <Typography variant="subtitle2">
                    {user?.email}
                    {/* <b>{format(new Date(), 'MMMM dd yyyy')}</b> */}
                    </Typography>
                </Grid>
            </Grid>
        </PageTitleWrapper>
        <Container maxWidth="lg">
            <div className="inner-page-section pt--70 pt_lg--130 pb--70 pb_lg-120">
                <div className="container">
                    <div className="row">
                        <main className="col-lg-12 main-content mb--60 mb-lg-0 text-left">
                        

                            {/* Plan */}
                            {
                                selectedPlan && (
                                    <div className="card">
                                        <div className="card-header">
                                            Selected Plan ({selectedPlan.name}) - {`${formatUSD(sub$().plan.amount)}/${sub$().plan.interval}`}
                                            {
                                                badge()
                                            }

                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                Selected Plan ({selectedPlan.name})
                                            </h5>
                                            <p className="card-text">
                                                {
                                                    selectedPlan.description
                                                }
                                            </p>

                                            {
                                                (sub$().status === 'canceled') && <small className="text-danger">
                                                    Subscription Cancelled and will be end at: {moment(sub$().current_period_end * 1000).toString()}
                                                </small>}
                                        </div>
                                    </div>
                                )
                            }

                            {/* Change Password */}
                            <div className="mt-5">
                                <ChangePasswordComponent />
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            </Container>
        </ContentWrapper>
    )
}
function ProfilePage() {
    return (
        <Provider store={store}>
            <ProfilePageContent/>
        </Provider>
    )
} 
export default ProfilePage;