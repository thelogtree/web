import { useWindowWidth } from '@react-hook/window-size';

const IS_WINDOW_SKINNY_THRESHOLD_WIDTH = 850;
// used to check if split screens should be allowed
// (primarily for sign up and sign in page)
export const useIsWindowSkinny = () => {
    const windowWidth = useWindowWidth();
    return windowWidth <= IS_WINDOW_SKINNY_THRESHOLD_WIDTH;
};
