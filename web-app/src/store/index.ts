import { proxy, useSnapshot } from 'valtio';
import { toast } from 'react-toastify';

const store = proxy<{
  errors: string[];
  infos: string[];
}>({
  errors: [],
  infos: [],
});

export function useStore() {
  return useSnapshot(store);
}

export function setError(value: string) {
  store.errors.push(value);
  toast.error(value);
}

export function setInfo(value: string) {
  store.infos.push(value);
  toast.info(value);
}
