const MatrixAnimation = (objectToAffect, animationMatri) => {
  return {
    tick: () => {
      objectToAffect.transform(animationMatri);
    }
  }
}

export { MatrixAnimation }