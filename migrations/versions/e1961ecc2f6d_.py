"""empty message

Revision ID: e1961ecc2f6d
Revises: eeeb7f177aee
Create Date: 2024-11-01 20:31:50.855449

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e1961ecc2f6d'
down_revision = 'eeeb7f177aee'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('migration', schema=None) as batch_op:
        batch_op.add_column(sa.Column('asset_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'assets', ['asset_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('migration', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('asset_id')

    # ### end Alembic commands ###
