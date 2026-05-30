import { getCached } from './simpleCache';
import { cardsApi, membersApi } from './api';

export const fetchCards = () =>
  getCached('cards', async () => {
    const r = await cardsApi.list();
    return r.data.data || [];
  });

export const fetchMembers = () =>
  getCached('members', async () => {
    const r = await membersApi.list();
    return r.data.data || [];
  });
