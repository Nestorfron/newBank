"""empty message

Revision ID: 6b36a48a09c2
Revises: e1961ecc2f6d
Create Date: 2024-11-01 20:35:09.701899

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b36a48a09c2'
down_revision = 'e1961ecc2f6d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.drop_constraint('assets_migration_id_fkey', type_='foreignkey')
        batch_op.drop_column('migration_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('assets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('migration_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('assets_migration_id_fkey', 'migration', ['migration_id'], ['id'])

    # ### end Alembic commands ###
