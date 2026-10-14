export type ContractId = "music" | "film" | "audiobook";
export type AccountType = "individual" | "org";

export interface ObState {
  accountType: AccountType | null;
  contracts: ContractId[];
  signed: Partial<Record<ContractId, string>>;
  setups: Partial<Record<ContractId, { name: string }>>;
  partyName: string;
  partyRegister: string;
  signerName?: string;
}

export interface AccountState {
  accountType: AccountType | null;
  signedContracts: ContractId[];
  setups: Partial<Record<ContractId, { name: string }>>;
  signedDates: Partial<Record<string, string>>;
  signatures?: Record<string, string>;
  contractParties?: Record<string, { name: string; register: string; signerName?: string; accountType?: AccountType }>;
  partyName?: string;
  partyRegister?: string;
  platformSignature?: string;
  kycVerified: boolean;
  kycVerifiedAt?: string;
  firstName: string;
  lastName: string;
  vatPayer: boolean;
}

const OB_KEY = "buteel_ob";
const ACC_KEY = "buteel_account";

const EMPTY_OB: ObState = { accountType: null, contracts: [], signed: {}, setups: {}, partyName: "", partyRegister: "" };
const EMPTY_ACC: AccountState = { accountType: null, signedContracts: [], setups: {}, signedDates: {}, kycVerified: false, firstName: "", lastName: "", vatPayer: false };

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
    const account = raw ? { ...EMPTY_ACC, ...JSON.parse(raw) } : { ...EMPTY_ACC };
    account.signedContracts = account.signedContracts.filter((id: ContractId) => account.signatures?.[id]?.startsWith("data:image/png;base64,"));
    return account;
  } catch {
    return { ...EMPTY_ACC };
  }
}

export function patchAccountState(patch: Partial<AccountState>) {
  localStorage.setItem(ACC_KEY, JSON.stringify({ ...getAccountState(), ...patch }));
}

export function addSignedContract(contractId: ContractId, setupName: string, signature: string, party: { name: string; register: string; signerName?: string; accountType?: AccountType }) {
  if (!signature.startsWith("data:image/png;base64,")) return;
  const acc = getAccountState();
  const today = new Date().toISOString().split("T")[0];
  patchAccountState({
    signedContracts: [...new Set([...acc.signedContracts, contractId])],
    setups: { ...acc.setups, [contractId]: { name: setupName } },
    signedDates: { ...acc.signedDates, [contractId]: today },
    signatures: { ...acc.signatures, [contractId]: signature },
    contractParties: { ...acc.contractParties, [contractId]: party },
  });
}

export function completeOnboarding() {
  const ob = getObState();
  const acc = getAccountState();
  const today = new Date().toISOString().split("T")[0];
  const newDates: Partial<Record<ContractId, string>> = { ...acc.signedDates };
  const signed = ob.contracts.filter(id => ob.signed[id]?.startsWith("data:image/png;base64,"));
  signed.forEach(c => { if (!newDates[c]) newDates[c] = today; });
  patchAccountState({
    accountType: ob.accountType ?? acc.accountType,
    signedContracts: [...new Set([...acc.signedContracts, ...signed])],
    signatures: { ...acc.signatures, ...Object.fromEntries(signed.map(id => [id, ob.signed[id]])) },
    contractParties: { ...acc.contractParties, ...Object.fromEntries(signed.map(id => [id, { name: ob.partyName, register: ob.partyRegister, signerName: ob.signerName ?? (ob.accountType === "individual" ? ob.partyName : ""), accountType: ob.accountType }])) },
    partyName: ob.partyName,
    partyRegister: ob.partyRegister,
    setups: { ...acc.setups, ...ob.setups },
    signedDates: newDates,
  });
  clearObState();
}
