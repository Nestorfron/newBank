"""empty message

Revision ID: c8adb21fca16
Revises: 0b6b859066aa
Create Date: 2024-10-29 20:43:46.037774

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c8adb21fca16'
down_revision = '0b6b859066aa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_mb_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'user_mb', ['user_mb_id'], ['id'])

    with op.batch_alter_table('engineer', schema=None) as batch_op:
        batch_op.add_column(sa.Column('provider_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'provider', ['provider_id'], ['id'])

    with op.batch_alter_table('provider', schema=None) as batch_op:
        batch_op.drop_constraint('provider_engineer_id_fkey', type_='foreignkey')
        batch_op.drop_column('engineer_id')

    with op.batch_alter_table('user_mb', schema=None) as batch_op:
        batch_op.drop_constraint('user_mb_asset_id_fkey', type_='foreignkey')
        batch_op.drop_column('asset_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_mb', schema=None) as batch_op:
        batch_op.add_column(sa.Column('asset_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('user_mb_asset_id_fkey', 'assets', ['asset_id'], ['id'])

    with op.batch_alter_table('provider', schema=None) as batch_op:
        batch_op.add_column(sa.Column('engineer_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('provider_engineer_id_fkey', 'engineer', ['engineer_id'], ['id'])

    with op.batch_alter_table('engineer', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('provider_id')

    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('user_mb_id')

    # ### end Alembic commands ###
