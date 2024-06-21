use anchor_lang::prelude::*;

declare_id!("GYb4aembe4KUgHV27LNadiNnNZqDVLEdBmAqXJpmbUQT");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
