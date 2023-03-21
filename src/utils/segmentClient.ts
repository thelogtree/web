import segmentPlugin from '@analytics/segment';
import Analytics from 'analytics';

export const analytics = Analytics({
    plugins: [
        segmentPlugin({
            writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY
        })
    ]
});

export const SegmentEvents = {
    SignedUp: 'Signed Up',
    LoggedIn: 'Logged In'
};
