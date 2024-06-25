use anchor_lang::prelude::*;

declare_id!("GYb4aembe4KUgHV27LNadiNnNZqDVLEdBmAqXJpmbUQT");

#[program]
pub mod counter {
    use super::*;

    pub fn create_counter(_ctx: Context<Create>, first_number: u64) -> Result<()> {
        _ctx.accounts.counter.count = first_number;
        _ctx.accounts.counter.authority = _ctx.accounts.authority.key();
        msg!("creando un contador con numero inicial {} ", first_number);
        Ok(())
    }

    pub fn delete_counter(_ctx: Context<Delete>) -> Result<()> {
        msg!("Contador eliminado");
        Ok(())
    }

    pub fn increment_counter(_ctx: Context<Increment>) -> Result<()> {
        _ctx.accounts.counter.count = _ctx.accounts.counter.count + 1;
        msg!(
            "incrementando el contador a un nuevo valor de numero: {}",
            _ctx.accounts.counter.count
        );
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(count: u64)]
pub struct Create<'info> {
    // 8 bytes para discriminador  + (lo que ocupe tu estructura)
    #[account(init, payer = authority, space = 8 + 8 + 32)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Delete<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut,
        constraint = counter.authority == counter.key(),
        close = authority
    )]
    pub counter: Account<'info, Counter>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}

#[account]
pub struct Counter {
    count: u64,       // 8 bytes
    authority: Pubkey, // 32 bytes
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized.")]
    NotAuthorized,
}
