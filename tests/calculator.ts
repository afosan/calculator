import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calculator } from "../target/types/calculator";
const { SystemProgram } = anchor.web3;
import { expect } from 'chai';

describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Referencing the program - Abstraction that allows us to call methods of our SOL program
  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  // Generating a keypair for our Calculator account
  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Solana Calculator Program";

  it("create Calculator instance", async () => {
    // Calling create instance - Set our calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
        calculator: calculatorPair.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }
    ).signers([calculatorPair]).rpc()

    // Fetching the account and reading if the text is actually in the account
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.greeting).to.eql(text)
  });

  it("addition", async () => {
    // Calling add
    await program.methods.add(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorPair.publicKey,
      }
    ).rpc()

    // Fetching the account and reading if the result is actually the correct
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  });

  it("subtraction", async () => {
    // Calling add
    await program.methods.sub(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorPair.publicKey,
      }
    ).rpc()

    // Fetching the account and reading if the result is actually the correct
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(-1))
  });

  it("multiplication", async () => {
    // Calling add
    await program.methods.mul(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorPair.publicKey,
      }
    ).rpc()

    // Fetching the account and reading if the result is actually the correct
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(6))
  });

  it("division", async () => {
    // Calling add
    await program.methods.div(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorPair.publicKey,
      }
    ).rpc()

    // Fetching the account and reading if the result is actually the correct
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(0))
  });
});
