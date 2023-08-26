import { connect } from "@tableland/sdk";
export default function Nft(props) {

    const dataFromTableland = async () => {
        const tableland = await connect({ network: "testnet", chain: "polygon-mumbai" });
        // For client-side apps, call `siwe` to prompt a browser wallet sign-in flow
        // await tableland.siwe();

        // Create a new table with a supplied SQL schema and optional `prefix`
        // @return {Connection} Connection object, including the table's `name`
        // const { name } = await tableland.create(
        // `id integer, name text, primary key (id)`, // Table schema definition
        // {
        //     prefix: `my_sdk_table` // Optional `prefix` used to define a human-readable string
        // }
        // );

        // // The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
        // console.log(name); // e.g., my_sdk_table_80001_311
        // // Without the supplied `prefix`, `name` would be be `_80001_311`

        // Insert a row into the table
        // @return {WriteQueryResult} On-chain transaction hash of the write query
        const name = "my_sdk_table_80001_1533";
        // const writeRes = await tableland.write(`INSERT INTO ${name} (id, name) VALUES (0, 'Bobby Tables');`);

        // Perform a read query, requesting all rows from the table
        const readRes = await tableland.read(`SELECT * FROM ${name};`);

        console.log(readRes);
    }

    dataFromTableland()
}