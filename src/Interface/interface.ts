
export default interface Props {
  value: string | number | readonly string[] | undefined;

  text?: string;
  type?: string;
  option?:string;
  icon?: React.ReactNode;
}