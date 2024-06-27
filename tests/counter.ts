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
  const counterKp = new anchor.web3.Keypair();
  const initValue = new BN(0);

  it("Create a counter", async () => {
    const tx = await program.methods.createCounter(initValue).accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([counterKp])
    .rpc();
    console.log("Your transaction signature", tx);

    const counter = await program.account.counter.fetch(counterKp.publicKey)
    console.log("counter count is: ", counter.count)
    assert(initValue.eq(counter.count))
  });

  it("Update a counter", async () => {

    const number = new BN(23);
    const tx = await program.methods.updateCounter(number).accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()

    console.log("Your transaction signature", tx);
    const counter = await program.account.counter.fetch(counterKp.publicKey);
    console.log("counter count is:", counter.count.toNumber());
    assert(number.eq(counter.count));
  });

  it("Increment a counter with Create", async () => {
    // Add your test here.
    const count = new BN(0);
    const numOne = new BN(1);
    const counterKp = new anchor.web3.Keypair();
    const txCreate = await program.methods.createCounter(count).accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([counterKp])
    .rpc();
    const counterFetched = await program.account.counter.fetch(counterKp.publicKey)

    const tx = await program.methods.incrementCounter().accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
      // systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
    console.log("Your transaction signature", tx);

    const counter = await program.account.counter.fetch(counterKp.publicKey)
    console.log("counter count is: ", counter.count)
    assert(numOne.eq(counter.count))
  });

  it("Increment a counter with fetch", async () => {

    let counter = await program.account.counter.fetch(counterKp.publicKey);
    const oldValue = counter.count;
    const tx = await program.methods.incrementCounter().accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()

    console.log("Your transaction signature", tx);
    counter = await program.account.counter.fetch(counterKp.publicKey);
    console.log("counter count is:", counter.count.toNumber());
    assert(oldValue.lt(counter.count));
  });

  it("Decrement a counter (-1)", async () => {

    let counter = await program.account.counter.fetch(counterKp.publicKey);
    const oldValue = counter.count;
    const tx = await program.methods.decrementCounter().accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()

    console.log("Your transaction signature", tx);
    counter = await program.account.counter.fetch(counterKp.publicKey);
    console.log("counter count is:", counter.count.toNumber());
    assert(oldValue.gt(counter.count));
  });

  it("Delete a counter", async () => {
    const tx = await program.methods.deleteCounter().accounts({
      counter: counterKp.publicKey,
      authority: provider.wallet.publicKey,
    })
    .rpc()

    console.log("Your transaction signature", tx);
    const counter = await program.account.counter.fetchNullable(counterKp.publicKey);
    assert.equal(counter,null);
  });
});
