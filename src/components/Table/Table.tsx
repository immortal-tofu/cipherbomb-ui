import { Contract } from 'ethers';

type TableProps = {
  account: string;
  contract: Contract;
};

export const Table = ({ contract, account }: TableProps) => {
  return <div>Table</div>;
};
