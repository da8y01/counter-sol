import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { BN } from "bn.js";
import { assert } from "chai";

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  it("Create a counter", async () => {
    // Add your test here.
    const count = new BN(0);
    const counterKp = new anchor.web3.Keypair();
    const tx = await program.methods.createCounter(count).accounts({
      contador: counterKp.publicKey,
      autoridad: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([counterKp])
    .rpc();
    console.log("Your transaction signature", tx);

    const counter = await program.account.contador.fetch(counterKp.publicKey)
    console.log("counter count is: ", counter.numero)
    assert(count.eq(counter.numero))
  });
});
