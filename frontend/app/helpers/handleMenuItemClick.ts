import { HandleAction } from "./handleAction";

export const handleMenuItemClick = (session: any, e: React.MouseEvent<HTMLElement>, href?: string) => {
    HandleAction(session, e, href); // Call HandleAction with session, event, and href
};
