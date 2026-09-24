export type ContractId = "music" | "film" | "audiobook";
export type AccountType = "individual" | "org";

export interface ObState {
  accountType: AccountType | null;
  contracts: ContractId[];
  signed: Partial<Record<ContractId, string>>;
  setups: Partial<Record<ContractId, { name: string }>>;
}

export interface AccountState {
  accountType: AccountType | null;
  signedContracts: ContractId[];
  setups: Partial<Record<ContractId, { name: string }>>;
  signedDates: Partial<Record<ContractId, string>>;
}

const OB_KEY = "buteel_ob";
const ACC_KEY = "buteel_account";

const EMPTY_OB: ObState = { accountType: null, contracts: [], signed: {}, setups: {} };
const EMPTY_ACC: AccountState = { accountType: null, signedContracts: [], setups: {}, signedDates: {} };

export function getObState(): ObState {
  try {
    const raw = localStorage.getItem(OB_KEY);
    return raw ? { ...EMPTY_OB, ...JSON.parse(raw) } : { ...EMPTY_OB };
  } catch {
    return { ...EMPTY_OB };
  }
}

export function patchObState(patch: Partial<ObState>) {
  localStorage.setItem(OB_KEY, JSON.stringify({ ...getObState(), ...patch }));
}

export function clearObState() {
  localStorage.removeItem(OB_KEY);
}

export function getAccountState(): AccountState {
  try {
    const raw = localStorage.getItem(ACC_KEY);
    return raw ? { ...EMPTY_ACC, ...JSON.parse(raw) } : { ...EMPTY_ACC };
  } catch {
    return { ...EMPTY_ACC };
  }
}

export function patchAccountState(patch: Partial<AccountState>) {
  localStorage.setItem(ACC_KEY, JSON.stringify({ ...getAccountState(), ...patch }));
}

export function addSignedContract(contractId: ContractId, setupName: string) {
  const acc = getAccountState();
  const today = new Date().toISOString().split("T")[0];
  patchAccountState({
    signedContracts: [...new Set([...acc.signedContracts, contractId])],
    setups: { ...acc.setups, [contractId]: { name: setupName } },
    signedDates: { ...acc.signedDates, [contractId]: today },
  });
}

export function completeOnboarding() {
  const ob = getObState();
  const acc = getAccountState();
  const today = new Date().toISOString().split("T")[0];
  const newDates: Partial<Record<ContractId, string>> = { ...acc.signedDates };
  ob.contracts.forEach(c => { if (!newDates[c]) newDates[c] = today; });
  patchAccountState({
    accountType: ob.accountType ?? acc.accountType,
    signedContracts: [...new Set([...acc.signedContracts, ...ob.contracts])],
    setups: { ...acc.setups, ...ob.setups },
    signedDates: newDates,
  });
  clearObState();
}
