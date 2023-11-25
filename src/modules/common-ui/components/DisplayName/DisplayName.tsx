type DisplayNameProps = {
  address: string;
  name: string;
};

export const DisplayName = ({ address, name }: DisplayNameProps) => {
  return <>{name ? `${name} (${address})` : address}</>;
};
