use anchor_lang::prelude::*;

declare_id!("GYb4aembe4KUgHV27LNadiNnNZqDVLEdBmAqXJpmbUQT");

#[program]
pub mod counter {
    use super::*;

    pub fn create_counter(_ctx: Context<Crear>, primer_numero: u64) -> Result<()> {
        _ctx.accounts.contador.numero = primer_numero;
        _ctx.accounts.contador.autoridad = _ctx.accounts.autoridad.key();
        msg!("creando un contador con numero inicial {} ", primer_numero);
        Ok(())
    }

    pub fn delete_counter(_ctx: Context<Borrar>) -> Result<()> {
        msg!("Contador eliminado");
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(count: u64)]
pub struct Crear<'info> {
    // 8 bytes para discriminador  + (lo que ocupe tu estructura)
    #[account(init, payer = autoridad, space = 8 + 8 + 32)]
    pub contador: Account<'info, Contador>,
    #[account(mut)]
    pub autoridad: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Borrar<'info> {
    #[account(mut)]
    pub autoridad: Signer<'info>,
    #[account(
        mut,
        constraint = contador.autoridad == contador.key(),
        close = autoridad
    )]
    pub contador: Account<'info, Contador>,
}

#[account]
pub struct Contador {
    numero: u64,       // 8 bytes
    autoridad: Pubkey, // 32 bytes
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized.")]
    NotAuthorized,
}
