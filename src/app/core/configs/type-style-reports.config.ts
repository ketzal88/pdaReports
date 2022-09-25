export interface TypeStyleReport {
  key: string;
  name: string;
  style: Style;
}

//Agregar los campos definidos en _variables.scss
export interface Style {
  backgroundColor: string;
}

const configReports: TypeStyleReport[] = [
  {
    key: 'pda',
    name: 'Estilo PDA',
    style: { backgroundColor: 'black' },
  },
  {
    key: 'pda-night',
    name: 'Estilo Night',
    style: { backgroundColor: 'red' },
  },
  {
    key: 'pda-sea',
    name: 'Estilo Sea',
    style: { backgroundColor: 'green' },
  },
];

export const reportsType: TypeStyleReport[] = configReports;
