import { ITEMS_PER_PAGE, MOVE_BACK, MOVE_FORWARD, PAGINATION_STATUS } from '../../../constants';
import { IUserData } from '../../../entities';
import { get } from '../../../services/redis';

export const generateInlineKeyboard = async (username: string) => {
  const userData = await get(username);

  if (!userData) {
    return;
  }

  const { menuList, activePage } = userData;
  const menuListMarkup = generateMenuListMarkup(menuList, activePage);
  const footerMarkup = generateFooterMarkup(menuList, activePage);

  return [...menuListMarkup, footerMarkup];
};

export function generateMenuListMarkup(
  menuList: IUserData['menuList'],
  activePage: IUserData['activePage']
) {
  const startIndex = activePage > 1 ? activePage * ITEMS_PER_PAGE - ITEMS_PER_PAGE : 0;
  const endIndex = startIndex + ITEMS_PER_PAGE - 1;

  const menuTitles = [...menuList].slice(startIndex, endIndex);

  return menuTitles.map((title) => [{ text: title, callback_data: title }]);
}

export function generateFooterMarkup(
  menuList: IUserData['menuList'],
  activePage: IUserData['activePage']
) {
  const pagesQuantity = Math.ceil(menuList.length / ITEMS_PER_PAGE);

  return [
    { text: '<-', callback_data: MOVE_BACK },
    { text: `${activePage} / ${pagesQuantity}`, callback_data: PAGINATION_STATUS },
    { text: '->', callback_data: MOVE_FORWARD },
  ];
}

export const generateInlineKeyboardAfterMoveBackAction = (userData: IUserData) => {
  if (userData.activePage === 1) {
    return;
  }

  const newPageNumber = userData.activePage - 1;

  const menuListMarkup = generateMenuListMarkup(userData.menuList, newPageNumber);
  const footerMarkup = generateFooterMarkup(userData.menuList, newPageNumber);

  return [...menuListMarkup, footerMarkup];
};

export const generateInlineKeyboardAfterMoveForwardAction = (userData: IUserData) => {
  const pagesQuantity = Math.ceil(userData.menuList.length / ITEMS_PER_PAGE);

  if (pagesQuantity === userData.activePage) {
    return;
  }

  const newPageNumber = userData.activePage + 1;

  const menuListMarkup = generateMenuListMarkup(userData.menuList, newPageNumber);
  const footerMarkup = generateFooterMarkup(userData.menuList, newPageNumber);

  return [...menuListMarkup, footerMarkup];
};
