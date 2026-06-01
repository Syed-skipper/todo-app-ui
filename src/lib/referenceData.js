import { getCached, invalidateCache } from './simpleCache';
import { cardsApi, familyMembersApi } from './api';

export const fetchCards = () =>
  getCached('cards', async () => {
    const r = await cardsApi.list();
    return r.data.data || [];
  });

export const fetchFamilyMembers = () =>
  getCached('familyMembers', async () => {
    const r = await familyMembersApi.list();
    return r.data.data || [];
  });

export { invalidateCache };
