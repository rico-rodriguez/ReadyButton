import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
  githubLink: {
    color: 'white',
    bottom: '20px',
    left: '20px',
    cursor: 'pointer',
    '&: hover': {
      color: '#f0f0f0',
      transition: 'color 0.5s ease-in-out',
    },
  },
});

export default function GitHubLink() {
  const classes = useStyles();

  return (
    <Tooltip title='View my GitHub profile' arrow>
      <a
        href='https://github.com/rico-rodriguez'
        className={classes.githubLink}
      >
        <GitHubIcon fontSize='large' />
      </a>
    </Tooltip>
  );
}
